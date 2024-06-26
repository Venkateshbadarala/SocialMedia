import React from 'react';
import RequestPage from '@/components/dashboardcomponents/Request/Request'; // Renamed import to avoid conflict

const Request = () => {
  return (
    <div className='flex  w-[32rem] h-[20rem]  border'>
      <RequestPage/>
    </div>
  );
};

export default Request;
