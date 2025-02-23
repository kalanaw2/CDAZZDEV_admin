'use client'
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useLogout from "@/hooks/logout";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
    name: yup.string().required("Course name is required"),
    description: yup.string().required("Description is required"),
    instructor: yup.string().required("Instructor is required"),
    duration: yup.string().required("Duration is required"),
    start_date: yup.string().required("Start date is required"),
    end_date: yup.string().required("End date is required"),
    price: yup.number().required("Price is required").positive("Price must be a positive number"),
    video: yup.string().url("Invalid URL").required("Video URL is required"),

});

const defaultValues = {
    name: "",
    description: "",
    instructor: "",
    duration: "",
    start_date: "",
    end_date: "",
    price: "",
    video: "",

};

const AddCourse = ({ setEditOpen, editOpen, fetchCourses }) => {
    const [videoUrlArray, setVideoUrlArray] = useState([]);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { logout } = useLogout();

    let token = "";
    if (typeof localStorage !== "undefined") {
        token = window.localStorage.getItem("token");
    }

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const onSubmit = async (data) => {
        if (videoUrlArray.length === 0) {
            Swal.fire({
                title: 'Please add at least one video URL.',
                icon: 'warning',
            });
            return;
        }
        console.log(data)
        Swal.fire({
            title: `Add Course`,
            text: "Are you sure you want to add the course?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancel",
            confirmButtonText: "Confirm",
            reverseButtons: true,
            customClass: {
                container: "custom-swal-container", // Add a custom class to the container
            },
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/add-course`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                name: data.name,
                                description: data.description,
                                instructor: data.instructor,
                                duration: data.duration,
                                start_date: data.start_date,
                                end_date: data.end_date,
                                price: data.price,
                                video: data.video,
                                video_urls: videoUrlArray,
                            }),
                        }
                    );
                    if (response.status == 403 || response.status == 401) {
                        let refreshToken = "";
                        if (typeof localStorage !== "undefined") {
                            refreshToken = window.localStorage.getItem("refreshToken");
                        }

                        try {
                            const tokenResponse = await fetch(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/student/token`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        refreshToken: refreshToken,
                                    }),
                                }
                            );
                            if (tokenResponse.status == 200) {
                                const tokendata = await tokenResponse.json();
                                window.localStorage.setItem("token", tokendata.accessToken);
                                token = tokendata.accessToken;
                                handleSave();
                            } else {
                                logout();
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    } else if (response.status == 201) {
                        Swal.fire({
                            title: "Course Created!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            customClass: {
                                container: "custom-swal-container", // Add a custom class to the container
                            },
                        });
                        handleEditClose();
                        fetchCourses();

                    }

                } catch (error) {

                    console.error(error);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    customClass: {
                        container: "custom-swal-container", // Add a custom class to the container
                    },
                });
            }
        });
    };

    const handleRemoveUrl = (urlToRemove) => {
        setVideoUrlArray(videoUrlArray.filter(url => url !== urlToRemove));
    };

    const handleAddUrl = () => {
        if (newVideoUrl) {
            setVideoUrlArray([...videoUrlArray, newVideoUrl]);
            setNewVideoUrl('');
        }
    };

    return (
        <div>
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="course-view-edit"
                aria-describedby="course-view-edit-description"
                sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
                <DialogTitle
                    id="course-view-edit"
                    sx={{
                        textAlign: "center",
                        fontSize: "1.5rem !important",
                    }}
                >
                    Add Course
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Course Name"
                                        rules={{ required: true }}
                                        {...register("name")}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name && errors.name.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Description"
                                        rules={{ required: true }}
                                        {...register("description")}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description && errors.description.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Instructor"
                                        rules={{ required: true }}
                                        {...register("instructor")}
                                        error={Boolean(errors.instructor)}
                                        helperText={errors.instructor && errors.instructor.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Duration"
                                        rules={{ required: true }}
                                        {...register("duration")}
                                        error={Boolean(errors.duration)}
                                        helperText={errors.duration && errors.duration.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        rules={{ required: true }}
                                        {...register("start_date")}
                                        error={Boolean(errors.start_date)}
                                        helperText={errors.start_date && errors.start_date.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="End Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        rules={{ required: true }}
                                        {...register("end_date")}
                                        error={Boolean(errors.end_date)}
                                        helperText={errors.end_date && errors.end_date.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Price"
                                        type="number"
                                        rules={{ required: true }}
                                        {...register("price")}
                                        error={Boolean(errors.price)}
                                        helperText={errors.price && errors.price.message}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Video URL"
                                        rules={{ required: true }}
                                        {...register("video")}
                                        error={Boolean(errors.video)}
                                        helperText={errors.video && errors.video.message}
                                    />
                                </Grid2>
                            </Grid2>

                            <Grid2 container spacing={2} sx={{ mt: 2 }}>
                                {/* Display existing video URLs */}
                                {videoUrlArray.map((url, index) => (
                                    <Grid2 size={{ xs: 12 }} key={index}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField
                                                fullWidth
                                                value={url}
                                                disabled
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 2 }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRemoveUrl(url)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </Grid2>
                                ))}

                                {/* Input for adding a new video URL */}
                                <div style={{ display: 'flex', alignItems: 'center', width:'100%' }}>

                                    <TextField
                                        fullWidth
                                        label="Add Video URL"
                                        variant="outlined"
                                        value={newVideoUrl}
                                        onChange={(e) => setNewVideoUrl(e.target.value)}
                                        size="small"
                                        sx={{ mr: 2, flexGrow: 1 }}
                                    />
                                    <Button
                                        onClick={handleAddUrl}
                                        color="success"
                                        variant="contained"
                                        disabled={!newVideoUrl}
                                        sx={{minWidth:'100px'}}
                                    >
                                        {'Add URL'}
                                    </Button>
                                </div>
                             
                            </Grid2>

                            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                                <Button variant="contained" type="submit">
                                    Submit
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleEditClose}>
                                    Cancel
                                </Button>
                            </Box>

                        </form>

                    </Box>
                </DialogContent>

            </Dialog>
        </div>
    );
};

export default AddCourse;
