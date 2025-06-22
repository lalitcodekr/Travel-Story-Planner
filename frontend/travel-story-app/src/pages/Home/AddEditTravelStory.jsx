import React, { useState } from "react";
import {
  MdAdd,
  MdDeleteOutline,
  MdUpdate,
  MdClose,
  MdDelete,
} from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );

  const [error, setError] = useState("");

  // Add New Travel Story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
      {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };

  // Update Travel Story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyInfo.imageUrl || "";

      let postData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        // Upload New Image
        const imageUploadRes = await uploadImage(storyImg);
        imageUrl = imageUploadRes.imageUrl || "";

        // Update imageUrl in postData
        postData.imageUrl = imageUrl;
      }

      const response = await axiosInstance.put(
        `/edit-story/${storyId}`,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again"
      );
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  // Delete story image and Update the story
  const handleDeleteStoryImg = async () => {
    // Deleting the Image
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });
    if (deleteImgRes.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      // Updating Story
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
      {/* Header: Title + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div className="flex flex-wrap items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
          <button className="btn-small" onClick={handleAddOrUpdateClick}>
            {type === "add" ? (
              <>
                <MdAdd className="text-lg" /> ADD STORY
              </>
            ) : (
              <>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </>
            )}
          </button>
          <button onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-2 text-right">{error}</p>}

      {/* Form Fields */}
      <div className="flex-1 flex flex-col gap-4 pt-6">
        {/* Title */}
        <div>
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-lg md:text-2xl text-slate-950 outline-none w-full border-b border-slate-200 py-1"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* Date Picker */}
        <div>
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        {/* Image Upload */}
        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />

        {/* Story Text Area */}
        <div className="flex flex-col gap-2">
          <label className="input-label">STORY</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full resize-none"
            placeholder="Your Story"
            rows={8}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        {/* Tags */}
        <div className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
