import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Upload } from "../components/Upload";
import { color, typography } from "../components/shared/style";

describe('test Upload component', ()=>{
  it('test corrent upload', ()=>{
    const wrapper = render(<Upload />);
    expect(wrapper).toMatchSnapshot();
  });
})