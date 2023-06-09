import { shallowMount, enableAutoUnmount } from "@vue/test-utils"
import ArticleCreator from "@/components/creators/ArticleCreator"

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(ArticleCreator, {
    props: {
      constants: {
        TEST: "test"
      },
      name: "Article name",
      text: "Article text",
      image: "Article image",
      alt: "Article alt",
      cat: "Article cat"
    },
    global: {
      mocks: {},
      stubs: {}
    }
  });
});

enableAutoUnmount(afterEach)

describe("ArticleCreator", () => {
  test("name", () => { 
    expect(ArticleCreator.name).toBe("ArticleCreator") 
  })

  test("components", () => { 
    expect(typeof ArticleCreator.components).toBe("object") 
  })

  test("props", () => { 
    expect(typeof ArticleCreator.props).toBe("object") 
  })

  test("data", () => { 
    expect(typeof ArticleCreator.data).toBe("function") 
  })

  test("methods", () => { 
    expect(typeof ArticleCreator.methods).toBe("object") 
  })
})

describe("Mounted ArticleCreator", () => {
  test("wrapper", () => { 
    expect(wrapper.exists()).toBe(true) 
  })

  test("wrapper components", () => { 
    expect(typeof wrapper.findComponent({ name: "BtnElt" })).toBe("object")
    expect(typeof wrapper.findComponent({ name: "CardElt" })).toBe("object")
    expect(typeof wrapper.findComponent({ name: "FieldElt" })).toBe("object")
    expect(typeof wrapper.findComponent({ name: "ListElt" })).toBe("object")
    expect(typeof wrapper.findComponent({ name: "Editor" })).toBe("object")
  })

  test("wrapper props", () => {
    expect(wrapper.props("constants")).toStrictEqual({ TEST: "test" })
  })

  test("wrapper data", () => {
    expect(wrapper.vm.name).toBe("")
    expect(wrapper.vm.text).toBe("")
    expect(wrapper.vm.image).toBe("")
    expect(wrapper.vm.alt).toBe("")
    expect(wrapper.vm.cat).toBe("")

    expect(wrapper.attributes("name")).toBe("Article name")
    expect(wrapper.attributes("text")).toBe("Article text")
    expect(wrapper.attributes("image")).toBe("Article image")
    expect(wrapper.attributes("alt")).toBe("Article alt")
    expect(wrapper.attributes("cat")).toBe("Article cat")
  })

  test("wrapper methods", () => {
    expect(typeof wrapper.vm.createArticle).toBe("function")
  })
});
