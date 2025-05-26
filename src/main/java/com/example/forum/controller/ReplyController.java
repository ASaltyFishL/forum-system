package com.example.forum.controller;

import com.example.forum.entity.Reply;
import com.example.forum.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics/{topicId}/replies")
public class ReplyController {
    @Autowired
    private ReplyService replyService;
    @GetMapping
    public Map<String, Object> list(@PathVariable Long topicId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Reply> replies = replyService.findByTopicId(topicId);
            // 确保每个回复都有有效的createTime
            for (Reply reply : replies) {
                // 确保回复有创建时间
                if (reply.getCreateTime() == null) {
                    reply.setCreateTime(new Date());
                }
                // 打印日志以便调试
                System.out.println("回复ID: " + reply.getId() + ", 用户ID: " + reply.getUserId() + ", 用户名: " + reply.getUsername());
            }
            result.put("success", true);
            result.put("message", "获取成功");
            result.put("data", replies);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@PathVariable Long topicId, @RequestBody Reply reply, @RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            reply.setTopicId(topicId);
            Reply createdReply = replyService.create(reply, userId);
            result.put("success", true);
            result.put("message", "创建成功");
            result.put("data", createdReply);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
    