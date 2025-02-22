"use client";
import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Grid2,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from "@mui/material";
import Link from "next/link";
import NavBar from "@/components/Layouts/NavBarLog";
import { useRouter } from "next/navigation";
import WrapContent from "@/components/Layouts/WrapContent";
import { DataGrid } from "@mui/x-data-grid";
import useLogout from "@/hooks/logout";
import EditStudent from "@/components/Students/EditStudent";
import AddStudent from "@/components/Students/AddStudent";

export default function HomePage() {
  const [tabledata, setTableData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [isLoading, setisLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter();
  const { logout } = useLogout()

  let token = ''
  if (typeof localStorage !== 'undefined') {
    token = window.localStorage.getItem('token')
  }

  const columns = [
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: ({ row }) => <div>{row.id}</div>
    },
    {
      flex: 0.2,
      headerClassName: 'super-app-theme--header',
      minWidth: 200,
      field: 'Name',
      headerName: 'Name',
      renderCell: ({ row }) => <Box sx={{}}>{row.name}</Box>
    },
    {
      flex: 0.15,
      headerClassName: 'super-app-theme--header',
      minWidth: 200,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }) => (
        <Box>
          {row.description}

        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Instructor',
      field: 'instructor',
      renderCell: ({ row }) => (
        <Box>
          {row.instructor}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Duration',
      field: 'duration',
      renderCell: ({ row }) => (
        <Box>
          {row.duration}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'start_date',
      field: 'start_date',
      renderCell: ({ row }) => (
        <Box>
          {row.start_date}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'End_date',
      field: 'End_date',
      renderCell: ({ row }) => (
        <Box>
          {row.end_date}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Price',
      field: 'Price',
      renderCell: ({ row }) => (
        <Box>
          {row.price}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Video',
      field: 'Video',
      renderCell: ({ row }) => (
        <Box>
          {row.video}
        </Box>
      )
    },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Video_url',
      field: 'Video_url',
      renderCell: ({ row }) => (
          <Box>
             {row.video}
          </Box>
      )
  },
    {
      flex: 0.1,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Status',
      field: 'Status',
      renderCell: ({ row }) => (
        <Box>
          {row.status}
        </Box>
      )
    },
    {
      flex: 0.15,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      field: 'actions',
      headerName: 'ACTION',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', mt: 2 }}>
          <Button
            variant='contained'
            sx={{ fontSize: '10px' }}
            size='small'
            color='info'
            onClick={() => hanldeEdit(row)}
          >
            Edit
          </Button>
        </Box>
      )
    }
  ]

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setisLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/all-courses`,
        {
          method: "Post",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        }
      );
      if (response.status == 403 || response.status == 401) {

        let refreshToken = ''
        if (typeof localStorage !== 'undefined') {
          refreshToken = window.localStorage.getItem('refreshToken')
        }

        try {
          const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/student/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken: refreshToken
            })
          })
          if (tokenResponse.status == 200) {
            const tokendata = await tokenResponse.json()
            window.localStorage.setItem('token', tokendata.accessToken)
            token = tokendata.accessToken
            fetchStudents()
          } else {
            logout()
          }
        } catch (error) {
          console.error(error)
        }
      }
      if (response.status == 200) {
        const data = await response.json();
        setTableData(data.result);
        setisLoading(false)
      }
      setisLoading(false)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const hanldeEdit = (row) => {
    setUserProfile(row)
    setEditOpen(true)
  }

  const handleAdd = () => {
    setOpen(true)
  }

  return (
    <Box>
      <WrapContent>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{}}>
              All Students
            </Typography>
            <Button variant="contained" onClick={handleAdd}>ADD Student</Button>
          </Box>

          <Card>
            <CardContent>
              <Box
                sx={{
                  height: "70vh",
                  width: "100%",
                  "& .super-app-theme--header": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                }}
              >
                {isLoading ? (
                  <Box
                    sx={{
                      mt: 6,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CircularProgress sx={{ mb: 4 }} />
                  </Box>
                ) : (
                  <>
                    {tabledata && (
                      <DataGrid
                        rowHeight={60}
                        pagination
                        rows={tabledata}
                        columns={columns}
                        rowCount={tabledata.length}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                      />
                    )}
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </WrapContent>

      <EditStudent setEditOpen={setEditOpen} editOpen={editOpen} userProfile={userProfile} fetchStudents={fetchStudents} />
      <AddStudent setEditOpen={setOpen} editOpen={open} userProfile={userProfile} fetchStudents={fetchStudents} />
    </Box>
  );
}
