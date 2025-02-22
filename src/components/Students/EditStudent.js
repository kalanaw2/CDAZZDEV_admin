'use client'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useLogout from '@/hooks/logout'


const EditStudent = ({ setEditOpen, editOpen, userProfile, fetchStudents }) => {
    const [editUserProfile, setEditUserProfile] = useState({
        id: 0,
        name: '',
        email:'',
        status: ''
    })
    const [error, setError] = useState('')
    const [buttondis, setButtondis] = useState(false)
   
    const {logout} = useLogout()

    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = window.localStorage.getItem('token')
    }

    useEffect(() => {
        setEditUserProfile({
            ...editUserProfile,
            id: userProfile?.id || 0,
            name: userProfile?.name || '',
            email: userProfile?.email || '',
            status: userProfile?.status || '',
        })
    }, [userProfile])

    const handleEditClose = () => {
        setEditOpen(false)
        setError('')
    }

    const handleSave = async () => {
        if (!editUserProfile?.name || !editUserProfile.email || !editUserProfile.status) {
            setError('Please fill all the sections')

            return
        }

        Swal.fire({
            title: `Update Student`,
            text: 'Are you sure you want to update the profile?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
            reverseButtons: true,
            customClass: {
                container: 'custom-swal-container', // Add a custom class to the container
                
            }
        }).then(async result => {
            if (result.isConfirmed) {
                setButtondis(true)
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/student/update`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            id: editUserProfile.id,
                            name: editUserProfile.name,
                            email: editUserProfile.email,
                            status: editUserProfile.status
                        })
                    })
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
                            handleSave()
                          } else {
                            logout()
                          }
                        } catch (error) {
                          console.error(error)
                        }
                      
                    } else if (response.status == 200) {
                        Swal.fire({
                            title: 'Profile Updated!',
                       
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            customClass: {
                                container: 'custom-swal-container' // Add a custom class to the container
                            }
                        })
                        handleEditClose()
                        fetchStudents()
                        setButtondis(false)
                    }
                    setButtondis(false)
                } catch (error) {
                    setButtondis(false)
                    console.error(error)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    customClass: {
                        container: 'custom-swal-container' // Add a custom class to the container
                    }
                })
            }
        })
    }

    const handleChange = e => {
        const { name, value } = e.target
        setEditUserProfile(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    return (
        <div>
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby='user-view-edit'
                aria-describedby='user-view-edit-description'
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
                <DialogTitle
                    id='user-view-edit'
                    sx={{
                        textAlign: 'center',
                        fontSize: '1.5rem !important',                   
                    }}
                >
                    Edit Student
                </DialogTitle>
                <DialogContent
                    
                >
                    <Box sx={{ mt: 2 }}>
                        <form>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        label='Name'
                                        name='name'                                     
                                        value={editUserProfile?.name}
                                        onChange={handleChange}
                                        
                                    />                               
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        label='Email'
                                        name='email'                                   
                                        value={editUserProfile?.email}
                                        onChange={handleChange}
                                        
                                    />                               
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        label='Status'
                                        name='status'
                                        error={!!error}
                                        helperText={error}
                                        value={editUserProfile?.status}
                                        onChange={handleChange}
                                        
                                    />                               
                                </Grid2>
                            </Grid2>
                        </form>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' sx={{ mr: 2 }} onClick={handleSave}  startIcon={buttondis ? ( <CircularProgress size={20} /> ) : null}   disabled={buttondis}>
                        Submit
                    </Button>
                    <Button variant='outlined' color='error' onClick={handleEditClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditStudent