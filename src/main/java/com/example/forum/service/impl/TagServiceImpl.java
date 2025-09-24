package com.example.forum.service.impl;

import com.example.forum.entity.Tag;
import com.example.forum.mapper.TagMapper;
import com.example.forum.mapper.BlogTagMapper;
import com.example.forum.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;
    
    @Autowired
    private BlogTagMapper blogTagMapper;
    
    private static final Logger logger = LoggerFactory.getLogger(TagServiceImpl.class);

    @Override
    public List<Tag> findAll() {
        return tagMapper.findAll();
    }

    @Override
    public Tag findById(Long id) {
        Tag tag = tagMapper.findById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }
        return tag;
    }

    @Override
    public Tag findByName(String name) {
        return tagMapper.findByName(name);
    }

    @Override
    public Tag create(Tag tag) {
        // 检查标签名称是否已存在
        Tag existingTag = tagMapper.findByName(tag.getName());
        if (existingTag != null) {
            throw new RuntimeException("标签名称已存在");
        }

        // 确保日期字段有值
        Date now = new Date();
        if (tag.getCreateTime() == null) {
            tag.setCreateTime(now);
        }
        if (tag.getUpdateTime() == null) {
            tag.setUpdateTime(now);
        }

        tagMapper.insert(tag);
        logger.info("创建标签成功: {}", tag);
        return tag;
    }

    @Override
    public Tag update(Tag tag) {
        // 检查标签是否存在
        Tag existingTag = tagMapper.findById(tag.getId());
        if (existingTag == null) {
            throw new RuntimeException("标签不存在");
        }

        // 检查标签名称是否已被其他标签使用
        Tag tagWithSameName = tagMapper.findByName(tag.getName());
        if (tagWithSameName != null && !tagWithSameName.getId().equals(tag.getId())) {
            throw new RuntimeException("标签名称已被使用");
        }

        // 更新标签信息
        existingTag.setName(tag.getName());
        existingTag.setUpdateTime(new Date());

        tagMapper.update(existingTag);
        logger.info("更新标签成功: {}", existingTag);
        return existingTag;
    }

    @Override
    public void delete(Long id) {
        Tag tag = tagMapper.findById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在");
        }

        // 删除博客与标签的关联
        blogTagMapper.deleteByTagId(id);
        
        // 删除标签
        tagMapper.delete(id);
        logger.info("删除标签成功: {}", tag);
    }

    @Override
    public List<Tag> findByBlogId(Long blogId) {
        return tagMapper.findByBlogId(blogId);
    }
}