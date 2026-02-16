'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { generatePatientId } from '@/lib/utils';
import { UserCircle } from 'lucide-react';

interface PatientFormProps {
  onSubmit: () => void;
}

export function PatientForm({ onSubmit }: PatientFormProps) {
  const { currentPatient, setPatientData } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenerateId = () => {
    setPatientData({ patientId: generatePatientId() });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPatient.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!currentPatient.patientId.trim()) {
      newErrors.patientId = 'Patient ID is required';
    }
    if (!currentPatient.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!currentPatient.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!currentPatient.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(currentPatient.age) < 1 || parseInt(currentPatient.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <UserCircle className="h-6 w-6 text-primary-500" />
          <div>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter patient details for the scan report</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              required
              value={currentPatient.firstName}
              onChange={(e) => setPatientData({ firstName: e.target.value })}
              error={errors.firstName}
            />

            <div>
              <Input
                label="Patient ID"
                placeholder="PT001"
                required
                value={currentPatient.patientId}
                onChange={(e) => setPatientData({ patientId: e.target.value })}
                error={errors.patientId}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateId}
                className="mt-1 text-xs"
              >
                Generate ID
              </Button>
            </div>
          </div>

          <Input
            label="Username"
            placeholder="@johndoe"
            required
            value={currentPatient.username}
            onChange={(e) => setPatientData({ username: e.target.value })}
            error={errors.username}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              required
              value={currentPatient.gender}
              onChange={(e) => setPatientData({ gender: e.target.value as 'M' | 'F' | '' })}
              error={errors.gender}
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </Select>

            <Input
              label="Age"
              type="number"
              placeholder="25"
              required
              min="1"
              max="120"
              value={currentPatient.age}
              onChange={(e) => setPatientData({ age: e.target.value })}
              error={errors.age}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

