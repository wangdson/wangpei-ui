import React from "react";
import { Upload } from "./index";
import {
	withKnobs,
	text,
	boolean,
	color,
	number,
	select,
} from "@storybook/addon-knobs";
import { Method, AxiosRequestConfig } from "axios";
import { action } from "@storybook/addon-actions";

export default {
  title: '高级组件/ Upload',
  component: Upload,
  decorators: [withKnobs],
}

const methods: Method[] = [
	"get",
	"GET",
	"delete",
	"DELETE",
	"head",
	"HEAD",
	"options",
	"OPTIONS",
	"post",
	"POST",
	"put",
	"PUT",
	"patch",
	"PATCH",
	"link",
	"LINK",
	"unlink",
	"UNLINK",
];

export const knobsUpload = () => {
	const uploadMode = select("uploadMode", ["default", "img"], "default");
	const axiosConfig: Partial<AxiosRequestConfig> = {
		url: text("url", "http://localhost:20001/user/uploadAvatar/"),
		method: select("method", methods, "post"),
	};
	const uploadFilename = text("uploadFilename", "avatar");

	return (
		<Upload 
			multiple={boolean('multiple', false)}
			accept={text('accept', '')}
			progress={boolean("progress", false)}
			max={number('max', 500)}
			onProgress={action("onProgress")}
			onRemoveCallback={action("onRemoveCallback")}
			axiosConfig={axiosConfig}
			uploadMode={uploadMode}
			uploadFileNames={uploadFilename}
		/>
	)
};

export const imgUpload = () => <Upload uploadMode="img"></Upload>;

export const progressUpload = () => <Upload progress={true}></Upload>;