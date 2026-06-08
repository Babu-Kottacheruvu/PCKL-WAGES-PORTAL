import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { TreeDivisionManagement } from './screens/TreeDivisionManagement';
import { LatexScrapWeighment } from './screens/LatexScrapWeighment';
import { RegularTappingOperations } from './screens/RegularTappingOperations';
import { SlaughterTapping } from './screens/SlaughterTapping';
import { FieldOperations } from './screens/FieldOperations';
import { LeaveHolidayManagement } from './screens/LeaveHolidayManagement';
import { EarningsRecoveries } from './screens/EarningsRecoveries';
import { AttendanceManagement } from './screens/AttendanceManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tree-division"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor']}>
                  <TreeDivisionManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/weighment"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Weighment Operator']}>
                  <LatexScrapWeighment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tapping-operations"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <RegularTappingOperations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/field-operations"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <FieldOperations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/earnings-recoveries"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <EarningsRecoveries />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-holiday-management"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <LeaveHolidayManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/slaughter-tapping"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <SlaughterTapping />
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={['System Admin', 'Head Office Admin', 'Estate Manager', 'Field Supervisor', 'Wage Processing Officer']}>
                  <AttendanceManagement />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Unauthorized</h1>
                <p className="text-gray-600">You don't have permission to view this page.</p>
              </div>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
