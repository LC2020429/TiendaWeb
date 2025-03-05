import { Router } from "express";
import {
  findCategory,
  listCategories,
  deleteCategory,
  saveCategory,
  updateCategory,
} from "./catePro.controller.js";
import {
  createCategoryValidator,
  getByIdCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  validateList,
} from "../middlewares/catePro-validators.js";

const router = Router();

router.post("/agregarCategoria", createCategoryValidator, saveCategory);
router.get("/buscarCategoria/:cpid", getByIdCategoryValidator, findCategory);
router.get("/", validateList, listCategories);
router.patch(
  "/actualizarCategoria/:cpid",
  updateCategoryValidator,
  updateCategory
);
router.delete(
  "/eliminarCategoria/:cpid",
  deleteCategoryValidator,
  deleteCategory
);

export default router;
