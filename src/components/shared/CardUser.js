import React from "react";

function CardUser() {
  return (
    <div>
      <div className="flex flex-col rounded-8 bg-green-800 p-4 w-full">
        <button>
          <div>
            <div
              className="relative inline-block"
              data-testid="single-user-avatar"
              style={{ width: "80px", height: "80px" }}
            >
              <img
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
                src="https://avatars.githubusercontent.com/u/47468791?v=4"
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col ml-3">
              <span className="text-sm text-primary-100 font-bold break-all text-left">
                Novice Doge
              </span>
              <span className="text-sm text-primary-300 text-left break-all">
                @A30QOXH6NPAN
              </span>
              <div className="mt-2"></div>
            </div>
          </div>
        </button>
        <div className="mt-3">
          <div>
            <a href="/u/A30QOXH6NPAN/followers">
              <span className="text-primary-100 font-bold">0</span>
              <span className="text-primary-300 ml-1">followers</span>
            </a>
          </div>
          <div className="ml-4">
            <a href="/u/A30QOXH6NPAN/following">
              <span className="text-primary-100 font-bold">0</span>
              <span className="text-primary-300 ml-1">following</span>
            </a>
          </div>
        </div>
        <div className="text-primary-300 mt-3 break-words text-left"></div>
      </div>
    </div>
  );
}

export default CardUser;
