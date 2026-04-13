import React, { createContext, useContext, useState, useMemo,type ReactNode } from 'react';

interface StudentContextType {
  rNo: string | null;
  studentData: any | null;
  setStudentData: (data: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studentData, setStudentData] = useState<any | null>(() => {
    const saved = localStorage.getItem('studentData');
    return saved ? JSON.parse(saved) : null;
  });
  
  const rNo = studentData?.rNo || null;

  const logout = () => {
    setStudentData(null);
    localStorage.removeItem('studentData');
  };

  const value = useMemo(() => ({
    rNo,
    studentData,
    setStudentData: (data: any) => {
      setStudentData(data);
      if (data) {
        localStorage.setItem('studentData', JSON.stringify(data));
      }
    },
    logout,
    isAuthenticated: !!studentData
  }), [rNo, studentData]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};