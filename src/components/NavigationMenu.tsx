import { ReactElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListSubheader from '@mui/joy/ListSubheader';

export interface MenuSectionProps {
  title?: string;
  items: MenuItemProps[];
}

export interface MenuItemProps {
  title: string;
  icon: ReactElement;
  path: string;
}

function MenuItem({ title, icon, path }: MenuItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(path === location.pathname);

  useEffect(() => {
    setIsActive(path === location.pathname);
  }, [path, location]);

  return (
    <ListItem>
      <ListItemButton
        variant={isActive ? 'soft' : 'plain'}
        color={isActive ? 'primary' : 'neutral'}
        component={'a'}
        href={path}
        onClick={(e) => {
          e.preventDefault();
          navigate(path);
        }}
      >
        <ListItemDecorator sx={{ color: 'neutral.500' }}>{icon}</ListItemDecorator>
        <ListItemContent>{title}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

export default function NavigationMenu({ sections }: { sections: MenuSectionProps[] }) {
  return (
    <List size='sm' sx={{ '--List-item-radius': '8px' }}>
      {sections.map(({ title, items }, index) => (
        <ListItem nested key={index}>
          {title && <ListSubheader>{title}</ListSubheader>}
          <List
            aria-labelledby='nav-list-browse'
            sx={{
              '& .JoyListItemButton-root': { p: '8px' },
            }}
          >
            {items.map((item) => (
              <MenuItem key={item.title} {...item} />
            ))}
          </List>
        </ListItem>
      ))}
    </List>
  );
}
