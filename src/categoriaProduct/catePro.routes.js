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
} from "../middlewares/catePro-validators.js";

const router = Router();

router.post("/agregarCategoria", createCategoryValidator, saveCategory);

router.get("/buscarCategoria/:cid", getByIdCategoryValidator, findCategory);

router.get("/", listCategories);

router.patch("/actualizarCategoria/:cid", updateCategoryValidator, updateCategory);

router.delete("/eliminarCategoria/:cid", deleteCategoryValidator, deleteCategory);

export default router;
