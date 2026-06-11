import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { CircuitHeader } from '../components/circuit/CircuitHeader';
import { CircuitToggleControl } from '../components/circuit/CircuitToggleControl';
import { CircuitUsageChart } from '../components/circuit/CircuitUsageChart';
import { CircuitScheduleEditor } from '../components/circuit/CircuitScheduleEditor';
import { CircuitInsightsCard } from '../components/circuit/CircuitInsightsCard';

type Circuit = {
  id: string;
  name: string;
  category: string;
  status: string;
  currentWatts: number;
  voltage: number;
  room: string;
  schedulingEnabled: boolean;
};

type UsagePoint = {
  id: string;
  circuitId: string;
  timestamp: string;
  watts: number;
  estimatedCost: number;
};

type ScheduleItem = {
  id: string;
  circuitId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export function CircuitDetailPage() {
  const { circuitId } = useParams();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [editableName, setEditableName] = useState('');
  const [usageHistory, setUsageHistory] = useState<UsagePoint[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCircuitData() {
      if (!circuitId) {
        setError('Missing circuit id in the route.');
        return;
      }

      try {
        const [circuitResponse, usageResponse, scheduleResponse] = await Promise.all([
          fetch(`/api/circuits/${circuitId}`),
          fetch(`/api/usage/circuit/${circuitId}`),
          fetch(`/api/schedules/circuit/${circuitId}`),
        ]);

        if (!circuitResponse.ok || !usageResponse.ok || !scheduleResponse.ok) {
          throw new Error('Failed to load circuit data.');
        }

        const circuitPayload = (await circuitResponse.json()) as { circuit: Circuit };
        const usagePayload = (await usageResponse.json()) as { usageHistory: UsagePoint[] };
        const schedulePayload = (await scheduleResponse.json()) as { schedules: ScheduleItem[] };

        if (!cancelled) {
          setCircuit(circuitPayload.circuit);
          setEditableName(circuitPayload.circuit.name);
          setUsageHistory(usagePayload.usageHistory);
          setSchedules(schedulePayload.schedules);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load circuit data.');
        }
      }
    }

    void loadCircuitData();

    return () => {
      cancelled = true;
    };
  }, [circuitId]);

  async function saveCircuitName() {
    if (!circuit || !circuitId) {
      return;
    }

    const trimmedName = editableName.trim();

    if (trimmedName.length === 0) {
      return;
    }

    setSavingName(true);
    setError(null);

    try {
      const response = await fetch(`/api/circuits/${circuitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        throw new Error('Unable to save circuit name.');
      }

      const payload = (await response.json()) as { circuit: Circuit };
      setCircuit(payload.circuit);
      setEditableName(payload.circuit.name);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save circuit name.');
    } finally {
      setSavingName(false);
    }
  }

  async function toggleCircuitStatus() {
    if (!circuit || !circuitId) {
      return;
    }

    const nextStatus = circuit.status === 'on' ? 'off' : 'on';

    setToggling(true);
    setError(null);

    try {
      const response = await fetch(`/api/circuits/${circuitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Unable to update circuit status.');
      }

      const payload = (await response.json()) as { circuit: Circuit };
      setCircuit(payload.circuit);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update circuit status.');
    } finally {
      setToggling(false);
    }
  }

  const insights = circuit
    ? [
        `${circuit.name} is currently drawing ${circuit.currentWatts.toLocaleString()} watts.`,
        'Peak-hour warnings and estimated cost trends will be layered in next.',
        'Scheduling and manual controls are ready for the next API interaction pass.',
      ]
    : ['Circuit insight text will appear once the data finishes loading.'];

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Circuit Detail
      </Typography>
      {error ? <Alert severity="warning">{error}</Alert> : null}
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Route Target
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {circuitId ?? 'unknown-circuit'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This page now loads real circuit, usage, and schedule data from the API.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {circuit ? (
        <Stack spacing={2}>
          <CircuitHeader
            name={circuit.name}
            category={circuit.category}
            status={circuit.status}
            room={circuit.room}
            editableName={editableName}
            onEditableNameChange={setEditableName}
            onSaveName={saveCircuitName}
            savingName={savingName}
          />
          <CircuitToggleControl status={circuit.status} onToggle={toggleCircuitStatus} toggling={toggling} />
          <CircuitUsageChart usageHistory={usageHistory} />
          <CircuitScheduleEditor schedules={schedules} />
          <CircuitInsightsCard insights={insights} />
        </Stack>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Loading circuit details...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}