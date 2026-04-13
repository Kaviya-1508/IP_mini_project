import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

interface FacultyContextType {
  facultyData: any | null;
  setFacultyData: (data: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facultyData, setFacultyData] = useState<any | null>(() => {
    const saved = localStorage.getItem('facultyData');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    setFacultyData(null);
    localStorage.removeItem('facultyData');
    localStorage.removeItem('facultyId');
  };

  const value = useMemo(() => ({
    facultyData,
    setFacultyData: (data: any) => {
      setFacultyData(data);
      if (data) {
        localStorage.setItem('facultyData', JSON.stringify(data));
        // ✅ FIXED: Store MongoDB _id (data.id), not data.facultyId
        localStorage.setItem('facultyId', data.id);
      }
    },
    logout,
    isAuthenticated: !!facultyData
  }), [facultyData]);

  return (
    <FacultyContext.Provider value={value}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error('useFaculty must be used within a FacultyProvider');
  }
  return context;
};