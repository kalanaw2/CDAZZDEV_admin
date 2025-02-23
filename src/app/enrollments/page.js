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
import EditEnrollment from "@/components/Enrollment/EditEnrol";
import AddEnrol from "@/components/Enrollment/AddEnrol";


export default function Enrollments() {
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
      minWidth: 100,
      field: 'Course ID',
      headerName: 'Course ID',
      renderCell: ({ row }) => <Box sx={{}}>{row.course_id}</Box>
    },
    {
      flex: 0.15,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      field: 'Student ID',
      headerName: 'Student ID',
      renderCell: ({ row }) => (
        <Box>
          {row.student_id
          }

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/all-enrollment`,
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
              All Enrolment 
            </Typography>
            <Button variant="contained" onClick={handleAdd}>ADD Enrolment</Button>
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

      <EditEnrollment setEditOpen={setEditOpen} editOpen={editOpen} userProfile={userProfile} fetchStudents={fetchStudents} />
      <AddEnrol setEditOpen={setOpen} editOpen={open} userProfile={userProfile} fetchStudents={fetchStudents} />
    </Box>
  );
}
