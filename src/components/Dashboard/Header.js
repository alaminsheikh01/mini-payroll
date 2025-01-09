import React from 'react';

import Logout from '../Logout';

const Header = ({ setIsAdding, setIsBulkAdding,  setIsAuthenticated }) => {
  return (
    <header>
      <h1>Employee Management Software</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button onClick={() => setIsAdding(true)} style={{marginRight:'10px'}}>Add Employee</button>
        <button onClick={() => setIsBulkAdding(true)}>Bulk Employee Add</button>
        <Logout setIsAuthenticated={setIsAuthenticated} />
      </div>
    </header>
  );
};

export default Header;
