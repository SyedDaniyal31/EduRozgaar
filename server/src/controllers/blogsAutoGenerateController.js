import { asyncHandler } from '../utils/asyncHandler.js';
import { generateBlogFromListings } from '../services/blogAutoGenerateService.js';

export const autoGenerateBlog = asyncHandler(async (req, res) => {
  const { jobIds, scholarshipIds, admissionIds, title } = req.body || {};
  const result = await generateBlogFromListings({
    jobIds: Array.isArray(jobIds) ? jobIds : [],
    scholarshipIds: Array.isArray(scholarshipIds) ? scholarshipIds : [],
    admissionIds: Array.isArray(admissionIds) ? admissionIds : [],
    title: title ? String(title).trim() : undefined,
  });
  res.status(201).json(result);
});
