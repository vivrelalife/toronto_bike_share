import { useReducer, useEffect, useState } from 'react';
import { applicationReducer, applicationInitialState } from './state/globalState';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { columns } from './constants';
import { Table, Layout, Button } from 'antd';
import { ReloadOutlined, StopOutlined } from '@ant-design/icons/lib/icons';
import './App.scss';
import { Station } from './types';

const { Header, Footer, Content } = Layout;
const apiUrl = 'https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/';
const runnerInterval = 30000;

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

  const renderLogo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1157.31 211.07"
      className="bs-normative-logo"
    >
      <defs>
        <clipPath id="a">
          <path fill="none" d="M-107.77-62.49h1370.75v388.43H-107.77z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path d="M854.62 14.29a14.74 14.74 0 0111-4.48 15.52 15.52 0 0115.63 15.64 14.49 14.49 0 01-4.54 10.82 15.33 15.33 0 01-11.09 4.41 15 15 0 01-11-4.34 14.65 14.65 0 01-4.41-10.89 15.25 15.25 0 014.41-11.16m22 182.75h-21.73v-127h21.78zm205.92-129.63A56.61 56.61 0 011134.46 99q7.69 15 7.82 34.22 0 .93-.4 8.15h-99.83q2.27 19 14.17 29.13t29 10.16q21.65 0 39.15-15.1l11.63 15q-20.58 19.25-52.12 19.25-28.47 0-46.44-18.31t-18-47.84q0-29.14 17.77-47.65t45.3-18.51m-.4 19.38q-16.44 0-26.86 10.09t-13 26.8H1120q-2-16.84-12.22-26.87t-25.6-10M169 86.32q19.11-18.9 48-18.91t48 18.91q19.19 18.92 19.18 47.24T265 180.81q-19.17 18.91-48 18.91t-48-18.91q-19.11-18.92-19.11-47.25T169 86.32M217 88q-19.24 0-32 12.9t-12.76 32.67q0 19.92 12.76 32.81t32 12.9q19.11 0 31.94-13t12.83-32.75q0-19.77-12.83-32.67T217 88m141.09-20.59q13.64 0 23.25 4.14L376 93.07q-9.22-4.93-21.79-4.94-14.7 0-23.85 10.42t-9.16 27.8V197h-21.78V70h21.52v16.79a46.11 46.11 0 0116.23-14.37 44.35 44.35 0 0120.92-5m190.29-.01q23.65 0 38.29 14t14.64 36.82V197h-21.92v-71.72q0-17.5-9.15-27.33t-25.73-9.82q-16 0-26.73 10.35t-10.69 27.33V197h-21.92v-71.72q0-17.5-9.15-27.33t-25.73-9.82q-15.9 0-26.73 10.22t-10.82 27.46V197H391V70h21.6v16.66A43.12 43.12 0 01431 72a59.57 59.57 0 0123.19-4.61q16 0 28.26 6.75a45.66 45.66 0 0118.65 18.78 43.94 43.94 0 0120-19.45 62.79 62.79 0 0127.33-6.08M134.87 197H113v-69a38.69 38.69 0 00-77.38 0v69H13.65v-69a60.61 60.61 0 01121.22 0zM746.5 70.08V197h-21.92v-17q-16.58 19.72-44.77 19.72-27 0-45.23-18.78t-18.25-47.38q0-28.59 18.25-47.37t45.23-18.78q28.34 0 44.77 19.78V70.08zM682.35 88q-19.51 0-31.6 13.1t-12.1 32.47q0 19.24 12.23 32.48t31.47 13.23q19.11 0 31.34-13t12.23-32.68q0-19.64-12.23-32.6t-31.34-13m341.19-17.92l-53.19 127.1h-25.66l-53.46-127.1h23.79l42.63 104.91 42.77-104.91h23.12zm-187.3 127.34a46.61 46.61 0 006-2l-4.44-17.74a46.25 46.25 0 01-16.39 2.86h-1.23c-11.67-.52-16.9-8.47-16.9-25.6V89.56h35V70h-35V31.18h-22V70h-20v19.56h20v66.13c0 16.39 2.85 27 9 33.33a26.39 26.39 0 008.72 6.47 42.59 42.59 0 0019 4.17 60.09 60.09 0 0014.78-1.42c1.12-.22 2.2-.48 3.26-.75l.25-.07"></path>
      </g>
    </svg>
  );

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
        {renderLogo()}
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
      <Footer> {renderLogo()}</Footer>
    </Layout>
  );
}

export default App;
