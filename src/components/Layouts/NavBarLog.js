"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Grid2,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import useLogout from "@/hooks/logout";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { logout } = useLogout();
  // Handle Dropdown Menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#E0E0E0 " }}>
        <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Avatar
              sx={{ ml: 2, cursor: "pointer" }}
              src="/user-avatar.jpg"
              onClick={handleClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
