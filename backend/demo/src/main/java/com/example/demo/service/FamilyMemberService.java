package com.example.demo.service;

import com.example.demo.model.FamilyMember;
import com.example.demo.model.User;
import com.example.demo.repository.FamilyMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FamilyMemberService {
    @Autowired
    private FamilyMemberRepository repository;

    public FamilyMember addMember(User user, FamilyMember member) {
        member.setUser(user);
        return repository.save(member);
    }

    public List<FamilyMember> getUserFamilyMembers(User user) {
        return repository.findByUser(user);
    }

    public void deleteMember(Long id) {
        repository.deleteById(id);
    }
}
