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
import { CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useLogout from '@/hooks/logout'

const EditCourse = ({ setEditOpen, editOpen, courseDetails, fetchCourses }) => {
    const [editCourse, setEditCourse] = useState({
        id: 0,
        name: '',
        description: '',
        instructor: '',
        duration: '',
        start_date: '',
        end_date: '',
        price: 0,
        status: '',
        video:''
    })
    const [error, setError] = useState('')
    const [buttonDis, setButtonDis] = useState(false)

    const { logout } = useLogout()

    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = window.localStorage.getItem('token')
    }

    useEffect(() => {
        setEditCourse({
            ...editCourse,
            id: courseDetails?.id || 0,
            name: courseDetails?.name || '',
            description: courseDetails?.description || '',
            instructor: courseDetails?.instructor || '',
            duration: courseDetails?.duration || '',
            start_date: courseDetails?.start_date || '',
            end_date: courseDetails?.end_date || '',
            price: courseDetails?.price || 0,
            status: courseDetails?.status || '',
            video: courseDetails?.video || ''
        })
    }, [courseDetails])

    const handleEditClose = () => {
        setEditOpen(false)
        setError('')
    }

    const handleSave = async () => {
        if (!editCourse?.name || !editCourse.description || !editCourse.instructor || !editCourse.duration || !editCourse.start_date || !editCourse.end_date || !editCourse.price || !editCourse.status || !editCourse.video) {
            setError('Please fill all the sections')
            return
        }

        Swal.fire({
            title: `Update Course`,
            text: 'Are you sure you want to update the course details?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
            reverseButtons: true,
            customClass: {
                container: 'custom-swal-container' // Add a custom class to the container
            }
        }).then(async result => {
            if (result.isConfirmed) {
                setButtonDis(true)
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/update-student-course`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            id: editCourse.id,
                            name: editCourse.name,
                            description: editCourse.description,
                            instructor: editCourse.instructor,
                            duration: editCourse.duration,
                            start_date: editCourse.start_date,
                            end_date: editCourse.end_date,
                            price: editCourse.price,
                            status: editCourse.status,
                            video: editCourse.video
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
                                const tokenData = await tokenResponse.json()
                                window.localStorage.setItem('token', tokenData.accessToken)
                                token = tokenData.accessToken
                                handleSave()
                            } else {
                                logout()
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    } else if (response.status == 200) {
                        Swal.fire({
                            title: 'Course Updated!',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            customClass: {
                                container: 'custom-swal-container' // Add a custom class to the container
                            }
                        })
                        handleEditClose()
                        fetchCourses()
                        setButtonDis(false)
                    }
                    setButtonDis(false)
                } catch (error) {
                    setButtonDis(false)
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
        setEditCourse(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    return (
        <div>
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="course-view-edit"
                aria-describedby="course-view-edit-description"
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
                <DialogTitle
                    id="course-view-edit"
                    sx={{
                        textAlign: 'center',
                        fontSize: '1.5rem !important',
                    }}
                >
                    Edit Course
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Course Name"
                                        name="name"
                                        value={editCourse?.name}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={editCourse?.description}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Instructor"
                                        name="instructor"
                                        value={editCourse?.instructor}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Duration"
                                        name="duration"
                                        value={editCourse?.duration}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        value={editCourse?.start_date}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="End Date"
                                        name="end_date"
                                        type="date"
                                        value={editCourse?.end_date}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Price"
                                        name="price"
                                        type="number"
                                        value={editCourse?.price}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Status"
                                        name="status"
                                        value={editCourse?.status}
                                        onChange={handleChange}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Video"
                                        name="video"
                                        value={editCourse?.video}
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
                    <Button
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={handleSave}
                        startIcon={buttonDis ? (<CircularProgress size={20} />) : null}
                        disabled={buttonDis}
                    >
                        Submit
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleEditClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditCourse
