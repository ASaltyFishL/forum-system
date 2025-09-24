package com.example.forum.controller;

import com.example.forum.common.Result;
import com.example.forum.entity.Tag;
import com.example.forum.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;
import java.util.List;

/**
 * 标签控制器
 */
@RestController
@RequestMapping("/api/tags")
public class TagController {
    
    private static final Logger logger = LoggerFactory.getLogger(TagController.class);
    
    @Autowired
    private TagService tagService;

    @GetMapping
    public Result<List<Tag>> list() {
        List<Tag> tags = tagService.findAll();
        return Result.success("获取成功", tags);
    }

    @GetMapping("/{id}")
    public Result<Tag> get(@PathVariable Long id) {
        Tag tag = tagService.findById(id);
        return Result.success("获取成功", tag);
    }

    @GetMapping("/blog/{blogId}")
    public Result<List<Tag>> listByBlogId(@PathVariable Long blogId) {
        List<Tag> tags = tagService.findByBlogId(blogId);
        return Result.success("获取成功", tags);
    }

    @PostMapping
    public Result<Tag> create(@Valid @RequestBody Tag tag) {
        Tag createdTag = tagService.create(tag);
        logger.info("创建标签成功: {}", tag);
        return Result.success("创建成功", createdTag);
    }

    @PutMapping("/{id}")
    public Result<Tag> update(@PathVariable Long id, @Valid @RequestBody Tag tag) {
        tag.setId(id);
        Tag updatedTag = tagService.update(tag);
        logger.info("更新标签成功: {}", tag);
        return Result.success("更新成功", updatedTag);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        logger.info("删除标签成功: {}", id);
        return Result.success("删除成功", null);
    }
}