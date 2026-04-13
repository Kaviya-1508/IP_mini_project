export interface Faculty {
  id?: string;          // ✅ Make it optional (MongoDB generates this)
  facultyId: string;
  facultyName: string;
  email: string;
  password: string;
}

export interface Student {
  id?: string;
  name: string;
  rNo: number;
  email: string;
  password: string;
}

export interface Event {
  id?: string;
  studentName: string;
  rNo: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventDescription: string;
  facultyId?: string;
}