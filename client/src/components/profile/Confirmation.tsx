import StatusProps from "interfaces/Status";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CircularProgress from '@mui/material/CircularProgress';
import { Status } from '../profile/Login/Login'


interface ConfirmationProps {
  status: Status,
  response: StatusProps
}

const Confirmation: React.FC<ConfirmationProps> = ({ status, response }) => {
  const renderStatus = () => {
    switch (status) {
      case 'pending':
        return (
          <div>
            {response.pending}
            <div>
              <CircularProgress />
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div>
            {response.rejected}
            <div>
              <DoNotDisturbOnIcon />
            </div>
          </div>
        );
      case 'resolved':
        return (
          <div>
            {response.resolved}
            <div>
              <DoneOutlineIcon />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{status !== '' && <div>{renderStatus()}</div>}</div>;
};

export default Confirmation;