// @ts-nocheck

import axios from "axios";
import type { Faculty, Student, Event } from "../types";
import type { AxiosInstance } from "axios";

// API Base URLs
// ✅ These are correct for production
const FACULTY_URL = "https://event-management-faculty.onrender.com/faculty";
const STUDENT_URL = "https://event-management-student.onrender.com";
const EVENT_URL = "https://event-management-events.onrender.com/api/stu_events";

// Create axios instances
const facultyApi = axios.create({ baseURL: FACULTY_URL });
const studentApi = axios.create({ baseURL: STUDENT_URL });
const eventApi = axios.create({ baseURL: EVENT_URL });

// Add request interceptor for logging
const addLoggingInterceptor = (instance: AxiosInstance, name: string) => {
  instance.interceptors.request.use(
    (config: any) => {
      console.log(`📤 ${name} Request:`, {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params
      });
      return config;
    },
    (error: any) => {
      console.error(`❌ ${name} Request Error:`, error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: any) => {
      console.log(`📥 ${name} Response:`, {
        status: response.status,
        data: response.data
      });
      return response;
    },
    (error: any) => {
      console.error(`❌ ${name} Response Error:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (!error.response) {
        error.message = 'Network error. Please check if the server is running.';
      } else if (error.response.status === 404) {
        error.message = 'Resource not found. Please check the API endpoint.';
      } else if (error.response.status === 500) {
        error.message = 'Server error. Please try again later.';
      } else if (error.response.status === 401) {
        error.message = 'Unauthorized. Please check your credentials.';
      } else if (error.response.status === 400) {
        error.message = error.response.data?.message || 'Bad request. Please check your input.';
      }

      return Promise.reject(error);
    }
  );
};

// Add interceptors to all instances
addLoggingInterceptor(facultyApi, 'Faculty');
addLoggingInterceptor(studentApi, 'Student');
addLoggingInterceptor(eventApi, 'Event');

// Faculty APIs
export const facultyRegister = (data: Faculty) =>
  facultyApi.post<Faculty>(`/register`, data);

export const facultyLogin = (data: { email: string; password: string }) =>
  facultyApi.post<Faculty>(`/login`, data);

// Student APIs
export const studentRegister = (data: Student) => {
  console.log('📝 Registering student:', data);
  return studentApi.post(`/regStudent`, data);
};

export const studentLogin = (data: { email: string; password: string }) => {
  console.log('🔐 Student login attempt:', data.email);
  return studentApi.post(`/StuLogin`, data);
};

// Event APIs
export const addEvent = (data: Event) => {
  console.log('📅 Adding event:', data);
  return eventApi.post(``, data);
};

export const getEvents = () => {
  console.log('📋 Fetching all events');
  return eventApi.get<Event[]>(``);
};

// ✅ FIXED: Get events by student roll number (returns array)
export const getEventsByStudent = (rNo: number) => {
  console.log(`🔍 Fetching events for student roll number: ${rNo}`);
  return eventApi.get<Event[]>(`/student/${rNo}`);
};

// ✅ FIXED: Get single event by roll number (deprecated, use getEventsByStudent)
export const getEventByRoll = (rNo: number) => {
  console.log(`⚠️ Deprecated: Use getEventsByStudent instead for roll number: ${rNo}`);
  return eventApi.get<Event>(`/${rNo}`);
};

// ✅ FIXED: Delete by event ID (not roll number)
export const deleteEvent = (eventId: string, facultyId: string) => {
  console.log(`🗑️ Deleting event with id: ${eventId}, facultyId: ${facultyId}`);
  return eventApi.delete(`/${eventId}?facultyId=${facultyId}`);
};

// ✅ FIXED: Update by event ID (not roll number)
export const updateEvent = (eventId: string, data: Event) => {
  console.log(`✏️ Updating event with id: ${eventId}`, data);
  return eventApi.put(`/${eventId}`, data);
};

export default { facultyApi, studentApi, eventApi };
