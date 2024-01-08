import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { paginateOption } from "../utils/pagination.js";
import { haveValue } from "../utils/helpers.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  try {
    const pagOps = paginateOption(
      page,
      limit,
      {
        field: "owner",
        select: "-password -refreshToken",
      },
      { sortBy, sortType }
    );

    let queryParams = {
      isPublished: false,
    };

    if (haveValue(userId)) {
      queryParams.owner = userId;
    }

    const aggregate = Video.aggregate([]);

    const videos = await Video.aggregatePaginate(aggregate, pagOps);
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "VideoFetched successfully"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Something went wrong");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  try {
    const videoPath = req.file?.path;

    if (!(title && description)) {
      throw new ApiError(400, "title and description required");
    }

    if (!haveValue(videoPath)) {
      throw new ApiError(400, "Video is required ");
    }

    const uploadedVideo = await uploadOnCloudinary(videoPath);

    if (!uploadedVideo.url) {
      throw new ApiError(400, "Error while uploading video");
    }

    const newVideoAdded = new Video({
      title,
      description,
      duration: uploadedVideo.duration,
      videoFile: uploadedVideo.url,
      owner: req.user,
    });

    await newVideoAdded.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, newVideoAdded, "New Video Added Successfully")
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Something went wrong");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
