import { shallowMount, enableAutoUnmount } from "@vue/test-utils"
import ProductCreator from "@/components/creators/ProductCreator"

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(ProductCreator, {
    props: {
      constants: {
        TEST: "test"
      },
      name: "Product name", 
      description: "Product description", 
      image: "Product image",
      alt: "Product alt",
      price: 100,
      options: "Product options", 
      cat: "Product cat"
    },
    global: {
      mocks: {},
      stubs: {}
    }
  });
});

enableAutoUnmount(afterEach)

describe("ProductCreator", () => {
  test("name", () => { 
    expect(ProductCreator.name).toBe("ProductCreator") 
  })

  test("components", () => { 
    expect(typeof ProductCreator.components).toBe("object") 
  })

  test("props", () => { 
    expect(typeof ProductCreator.props).toBe("object") 
  })

  test("data", () => { 
    expect(typeof ProductCreator.data).toBe("function") 
  })

  test("methods", () => { 
    expect(typeof ProductCreator.methods).toBe("object") 
  })
})

describe("Mounted ProductCreator", () => {
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
    expect(wrapper.vm.description).toBe("")
    expect(wrapper.vm.image).toBe("")
    expect(wrapper.vm.alt).toBe("")
    expect(wrapper.vm.price).toBe(null)
    expect(wrapper.vm.options).toBe("")
    expect(wrapper.vm.cat).toBe("")

    expect(wrapper.attributes("name")).toBe("Product name")
    expect(wrapper.attributes("description")).toBe("Product description")
    expect(wrapper.attributes("image")).toBe("Product image")
    expect(wrapper.attributes("alt")).toBe("Product alt")
    expect(wrapper.attributes("price")).toBe("100")
    expect(wrapper.attributes("options")).toBe("Product options")
    expect(wrapper.attributes("cat")).toBe("Product cat")
  })

  test("wrapper methods", () => { 
    expect(typeof wrapper.vm.createProduct).toBe("function") 
  })
});
