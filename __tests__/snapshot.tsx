import renderer from "react-test-renderer";

import About from "../pages/about";
import Index from "../pages/index";

it("renders index unchanged", () => {
  const tree = renderer.create(<Index />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders about unchanged", () => {
  const tree = renderer.create(<About />).toJSON();
  expect(tree).toMatchSnapshot();
});
