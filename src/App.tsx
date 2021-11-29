import { useReducer, useEffect, useState } from 'react';
import { applicationReducer, applicationInitialState } from './state/globalState';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { columns } from './constants';
import { Table, Layout, Button } from 'antd';
import { ReloadOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import './App.scss';
import { Station } from './types';

const { Header, Content } = Layout;
const apiUrl = 'https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/';
const runnerInterval = 3000;

function App() {
  const [state, dispatch] = useReducer(applicationReducer, applicationInitialState);
  const [localStations, setLocalStations] = useState<Station[]>([]);
  const [running, setRunning] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const { loading, stations, statusesLoaded } = state;

  const fetchStations = async () => {
    try {
      const response = await fetch(`${apiUrl}station_information`);
      const json = await response.json();
      dispatch({ type: 'SET_STATIONS', stations: json?.data?.stations });
      fetchStatuses();
    } catch (e) {
      console.error('fetch()', e);
    }
  };

  const fetchStatuses = async () => {
    dispatch({ type: 'LOAD_STATIONS', stations: [] });
    try {
      const response = await fetch(`${apiUrl}station_status`);
      const json = await response.json();
      dispatch({ type: 'SET_STATIONS_STATUS', statuses: json?.data?.stations });

      setRunning(true);
    } catch (e) {
      console.error('fetch()', e);
    }
  };

  const reload = () => {
    setRunning(false);
    fetchStatuses();
  };

  const stopInterval = () => {
    setRunning(false);
  };

  const handleTableChange = (paginationConfig: TablePaginationConfig): void => {
    if (paginationConfig.pageSize) setPageSize(paginationConfig.pageSize);
  };

  useEffect(() => {
    fetchStations();
    dispatch({ type: 'LOAD_STATIONS', stations: [] });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLocalStations(stations);
    // eslint-disable-next-line
  }, [statusesLoaded]);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        fetchStatuses();
      }, runnerInterval);
      return () => clearInterval(interval);
    }
    return;
  }, [running]);

  return (
    <Layout className="bs-application-layout">
      <Header>
        <h1>Toronto's Bike Share Info</h1>
      </Header>
      <Content>
        <div className="bs-reload-container">
          <Button disabled={loading} onClick={reload} loading={loading}>
            <ReloadOutlined /> Reload
          </Button>
        </div>
        <div className="bs-reload-container">
          <Button
            disabled={!statusesLoaded}
            onClick={() => stopInterval()}
            loading={loading}
          >
            <StopOutlined /> Stop auto reload
          </Button>
        </div>

        <Table<Station>
          loading={loading}
          columns={columns}
          dataSource={localStations}
          pagination={{ position: ['bottomCenter'], pageSize, showSizeChanger: true }}
          onChange={handleTableChange}
        />
      </Content>
  
    </Layout>
  );
}

export default App;
