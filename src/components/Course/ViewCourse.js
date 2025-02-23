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
import { CircularProgress, Divider } from '@mui/material'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import useLogout from '@/hooks/logout'


const ViewCourse = ({ setEditOpen, editOpen, course }) => {
    const handleEditClose = () => {
        setEditOpen(false)
    }

    return (
        <div>
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle
                    id="user-view-edit"
                    sx={{
                        textAlign: 'center',
                        fontSize: '1.5rem !important',
                    }}
                >
                    {course?.name}
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Description:</strong> {course?.description}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Instructor:</strong> {course?.instructor}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Duration:</strong> {course?.duration}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Start Date:</strong> {new Date(course?.start_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>End Date:</strong> {new Date(course?.end_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Price:</strong> ${course?.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Status:</strong> {course?.status}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Course Video
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <iframe
                                width="100%"
                                height="315"
                                src={course?.video}
                                title="Course Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Related Videos
                        </Typography>
                        <Grid2 container spacing={2}>
                            {course?.video_urls.map((url, index) => (
                                <Grid2 size={{xs:12, sm:6}} key={index}>
                                    <iframe
                                        width="100%"
                                        height="315"
                                        src={url}
                                        title={`Related Video ${index + 1}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ViewCourse