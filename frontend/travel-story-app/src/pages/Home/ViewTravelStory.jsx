import moment from "moment";
import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate, MdDeleteOutline, MdAdd, MdClose } from "react-icons/md";

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
      {/* Header Buttons */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-3">
        <div className="flex flex-wrap items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
          <button className="btn-small" onClick={onEditClick}>
            <MdUpdate className="text-lg" /> UPDATE STORY
          </button>
          <button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdDeleteOutline className="text-lg" /> DELETE STORY
          </button>
          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3 py-6">
        {/* Title */}
        <h1 className="text-2xl text-slate-950 break-words">
          {storyInfo?.title}
        </h1>

        {/* Date & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs text-slate-500">
            {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
          </span>

          <div className="inline-flex flex-wrap items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
            <GrMapLocation className="text-sm" />
            {storyInfo &&
              storyInfo.visitedLocation.map((item, index) =>
                storyInfo.visitedLocation.length === index + 1
                  ? `${item}`
                  : `${item}, `
              )}
          </div>
        </div>

        {/* Image */}
        {storyInfo?.imageUrl && (
          <img
            src={storyInfo.imageUrl}
            alt="Selected"
            className="w-full max-h-[300px] object-cover rounded-lg"
          />
        )}

        {/* Story Content */}
        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo?.story}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
