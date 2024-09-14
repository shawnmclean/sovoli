import { tsr } from "@ts-rest/serverless/fetch";
import { getBoundary, parse as parseMultipart } from "parse-multipart-data";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { authMiddleware } from "../authMiddleware";
import { userContract } from "./userContract";

export const userRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(userContract)
  .routeWithMiddleware("me", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async (_, { request: { user } }) => {
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name,
            username: user.username,
          },
        });
      }),
  )
  .routeWithMiddleware("ping", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ query: { message } }, { request: { user } }) => {
        return Promise.resolve({
          status: 200,
          body: {
            message: `${user.name} says ${message ?? "Hello"}`,
          },
        });
      }),
  )
  .routeWithMiddleware("upload", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async (_, { request }) => {
        const contentType = request.headers.get("Content-Type");

        if (!contentType) {
          return {
            status: 400,
            body: {
              error: "Content-Type header is missing",
            },
          };
        }

        // Get the boundary from the content-type header
        const boundary = getBoundary(contentType);

        // Read the request body as an ArrayBuffer
        const bodyBuffer = await request.arrayBuffer();

        // Parse the multipart data using the boundary
        const parts = parseMultipart(Buffer.from(bodyBuffer), boundary);
        if (parts.length === 0) {
          return {
            status: 400,
            body: {
              error: "No files uploaded",
            },
          };
        }

        // Iterate over the parsed parts (files) and extract file metadata
        const filesInfo = parts.map((part, index) => {
          const fileName = part.filename ?? `file${index + 1}`;
          const fileSize = part.data.length; // File size in bytes

          return {
            fileName, // Extract file name
            fileSize: `${fileSize} bytes`, // Return file size
          };
        });

        // Return success response with file details
        return {
          status: 200,
          body: {
            message: "Files uploaded successfully",
            files: filesInfo, // Include metadata for each file
          },
        };
      }),
  );
