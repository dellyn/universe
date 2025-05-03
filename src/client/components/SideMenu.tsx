import HomeIcon from '@icons/Home';
import { Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@ui-library';
import React from 'react';
import { Link as RouterLink } from 'react-router';

const drawerWidth = 240;

interface IListItemLinkProps {
  icon?: React.ReactElement<any>;
  primary: string;
  to: string;
}

function ListItemLink(props: IListItemLinkProps) {
  const { icon, primary, to } = props;

  return (
    <ListItemButton component={RouterLink} to={to}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

export const SideMenu: React.FC = () => {
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemLink to='/' primary='Home' icon={<HomeIcon />} />
        </ListItem>
        </List>
</Drawer>
  );
};
