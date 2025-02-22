"use client";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography, 
  Box
} from "@mui/material";
import { School, Book, HowToReg } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { text: "Student Management", icon: <School />, path: "/" },
    { text: "Course Management", icon: <Book />, path: "/courses" },
    { text: "Enrollment Management", icon: <HowToReg />, path: "/enrollments" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box", backgroundColor: '#1E272E' },
      }}
    >
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1,  height:'64px', mb:2}}>
        <Link href="/" style={{ textDecoration: "none", color: "white", height:'100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: "100%", width:'auto' }} />
        </Link>
      </Box>

      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => router.push(path)}>
              <ListItemIcon sx={{color:'white'}}>{icon}</ListItemIcon>
              <ListItemText primary={text}  sx={{color:'white'}}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
