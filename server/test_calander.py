import os
import datetime
import pytz
import urllib.parse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

# --- CONFIGURATION ---
load_dotenv()
CALENDAR_ID = os.getenv("calander_api")
SERVICE_ACCOUNT_FILE = 'service-account.json'
SCOPES = ['https://www.googleapis.com/auth/calendar']

# Define working hours in India Standard Time
LOCAL_TIMEZONE = pytz.timezone('Asia/Kolkata')
WORK_START_HOUR = 10  # 10:00 AM
WORK_END_HOUR = 16    # 4:00 PM (16:00)
SLOT_DURATION_MINUTES = 15

def generate_google_calendar_url(title: str, description: str, start_dt: datetime.datetime, end_dt: datetime.datetime, location: str = "DTU Main Campus, Shahbad Daulatpur, Delhi") -> str:
    """Generates a direct 1-click Google Calendar web event URL for students and admins."""
    try:
        if not start_dt.tzinfo:
            start_dt = LOCAL_TIMEZONE.localize(start_dt)
        if not end_dt.tzinfo:
            end_dt = LOCAL_TIMEZONE.localize(end_dt)
        utc_start = start_dt.astimezone(pytz.utc).strftime('%Y%m%dT%H%M%SZ')
        utc_end = end_dt.astimezone(pytz.utc).strftime('%Y%m%dT%H%M%SZ')
    except Exception:
        utc_start = start_dt.strftime('%Y%m%dT%H%M%SZ')
        utc_end = end_dt.strftime('%Y%m%dT%H%M%SZ')
        
    params = {
        'action': 'TEMPLATE',
        'text': title,
        'dates': f"{utc_start}/{utc_end}",
        'details': description,
        'location': location
    }
    return 'https://calendar.google.com/calendar/render?' + urllib.parse.urlencode(params)

def get_calendar_service():
    """Authenticates with Google Calendar API using service-account.json if present."""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        return None
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Calendar auth note: {e}")
        return None

def find_next_slot(service):
    """Finds next available 15-minute slot in Google Calendar."""
    if not CALENDAR_ID or not service:
        return None
    now = LOCAL_TIMEZONE.localize(datetime.datetime.now())
    end_date = now + datetime.timedelta(days=7)
    try:
        events_result = service.events().list(
            calendarId=CALENDAR_ID,
            timeMin=now.isoformat(),
            timeMax=end_date.isoformat(),
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        busy_events = events_result.get('items', [])
    except Exception as e:
        print(f"Error fetching calendar events: {e}")
        return None

    start_time = now
    if start_time.minute % 15 != 0:
        start_time = start_time.replace(
            minute=(start_time.minute // 15 + 1) * 15, second=0, microsecond=0
        )
    current_time = start_time
    while current_time < end_date:
        if WORK_START_HOUR <= current_time.hour < WORK_END_HOUR:
            slot_start = current_time
            slot_end = current_time + datetime.timedelta(minutes=SLOT_DURATION_MINUTES)
            is_free = True
            for event in busy_events:
                event_start_str = event['start'].get('dateTime', event['start'].get('date'))
                event_end_str = event['end'].get('dateTime', event['end'].get('date'))
                if 'T' in event_start_str:
                    event_start = datetime.datetime.fromisoformat(event_start_str)
                else:
                    event_start = LOCAL_TIMEZONE.localize(datetime.datetime.fromisoformat(event_start_str))
                if 'T' in event_end_str:
                    event_end = datetime.datetime.fromisoformat(event_end_str)
                else:
                    event_end = LOCAL_TIMEZONE.localize(datetime.datetime.fromisoformat(event_end_str))
                if max(slot_start, event_start) < min(slot_end, event_end):
                    is_free = False
                    current_time = event_end
                    if current_time.minute % 15 != 0:
                        current_time = current_time.replace(
                            minute=(current_time.minute // 15 + 1) * 15, second=0, microsecond=0
                        )
                    break
            if is_free:
                return {"start": slot_start, "end": slot_end}
        if not is_free:
            continue
        current_time += datetime.timedelta(minutes=SLOT_DURATION_MINUTES)
        if current_time.hour >= WORK_END_HOUR:
            current_time = current_time.replace(
                hour=WORK_START_HOUR, minute=0, second=0
            ) + datetime.timedelta(days=1)
    return None

def find_next_slot_smart(service=None, preferred_hint: str = ""):
    """Returns next slot via Google Calendar API if active, or calculates next business slot."""
    if service and CALENDAR_ID:
        slot = find_next_slot(service)
        if slot:
            return slot

    # Fallback to realistic calculation
    now = datetime.datetime.now(LOCAL_TIMEZONE)
    days_ahead = 1
    check_date = now + datetime.timedelta(days=days_ahead)
    while check_date.weekday() >= 5:  # Skip Saturday/Sunday
        days_ahead += 1
        check_date = now + datetime.timedelta(days=days_ahead)

    if "afternoon" in preferred_hint.lower() or "3 pm" in preferred_hint.lower() or "after 3" in preferred_hint.lower():
        hour = 15
        minute = 30
    else:
        hour = 11
        minute = 30

    slot_start = check_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    slot_end = slot_start + datetime.timedelta(minutes=SLOT_DURATION_MINUTES)
    return {"start": slot_start, "end": slot_end}

def book_slot(service, slot, student_id="Student"):
    """Books slot via Google Calendar API if credentials are present."""
    if not service or not CALENDAR_ID:
        return None
    event = {
        'summary': f'DTU Document Verification - {student_id}',
        'description': f'Appointment for {student_id} (Doc IT Portal)',
        'start': {
            'dateTime': slot['start'].isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': slot['end'].isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
    }
    try:
        created_event = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
        return created_event
    except Exception as e:
        print(f"Error booking slot on Google Calendar API: {e}")
        return None