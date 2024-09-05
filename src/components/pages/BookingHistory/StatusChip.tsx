import React from 'react';
import { Chip } from '@mui/material';
import { PROCESS_STATUS_VN } from '../../../constants/consts';

const statusColorMap: Record<string, string> = {
  canceled: 'grey',
  pending: 'orange',
  approved: 'blue',
  reject: 'red',
  processing: '#FBC02D',
  completed: '#43A047',
  deposited: 'purple',
  done: '#AFB42B',
};

interface StatusChipProps {
  status?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const statusLowerCase =
    status?.toLowerCase() as keyof typeof PROCESS_STATUS_VN;

  const statusLabel =
    PROCESS_STATUS_VN[statusLowerCase] || PROCESS_STATUS_VN.pending;
  const backgroundColor =
    statusColorMap[statusLowerCase] || statusColorMap.pending;

  return (
    <Chip
      label={statusLabel}
      sx={{
        height: '24px',
        width: '100px',
        fontSize: 10,
        fontWeight: 600,
        backgroundColor: backgroundColor,
        color: 'white',
      }}
    />
  );
};

export default StatusChip;
