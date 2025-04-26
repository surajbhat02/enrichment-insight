import { Header, HeaderAction, HeaderContent } from '@salt-ds/lab';
import { H1 } from '@salt-ds/core';
import { MonitorIcon } from '@salt-ds/icons'; // Use a relevant Salt icon

export function Navbar() {
  return (
    <Header>
      {/* Adjust variant='primary' based on desired Salt look */}
      <HeaderContent>
        <MonitorIcon size={1} style={{ marginRight: 'var(--salt-spacing-1)' }} />
        <H1 style={{ margin: 0 }}>Enrichment Insights</H1>
      </HeaderContent>
      {/* Add HeaderActions if needed */}
      {/* <HeaderAction>Action 1</HeaderAction> */}
    </Header>
  );
}
