package com.example.forum.service.impl;

import com.example.forum.entity.Reply;
import com.example.forum.mapper.ReplyMapper;
import com.example.forum.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReplyServiceImpl implements ReplyService {

    @Autowired
    private ReplyMapper replyMapper;

    @Override
    public List<Reply> findByTopicId(Long topicId) {
        List<Reply> replies = replyMapper.findByTopicId(topicId);
        
        // 确保所有回复都有有效的创建时间
        for (Reply reply : replies) {
            if (reply.getCreateTime() == null) {
                reply.setCreateTime(new Date());
            }
        }
        
        return replies;
    }

    @Override
    public Reply create(Reply reply, Long userId) {
        // 设置用户ID
        reply.setUserId(userId);
        
        // 设置创建时间
        Date now = new Date();
        reply.setCreateTime(now);
        
        // 插入回复
        replyMapper.insert(reply);
        
        return reply;
    }
}
    