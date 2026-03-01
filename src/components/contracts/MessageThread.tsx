'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Input, Button, Spin, Empty, Popconfirm, Tooltip, Avatar } from 'antd';
import { SendOutlined, DeleteOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import {
  useMediationContractMessages,
  useCreateMediationContractMessage,
  useDeleteMediationContractMessage,
} from '@/hooks/api/useMediationContractMessages';
import type { MediationContractMessage } from '@/types/api.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';

dayjs.extend(relativeTime);

interface MessageThreadProps {
  contractId: number;
  language: string;
}

export default function MessageThread({ contractId, language }: MessageThreadProps) {
  const isRTL = language === 'ar';

  // ==================== Data ====================
  const { data: messages = [], isLoading } = useMediationContractMessages(contractId);
  const createMutation = useCreateMediationContractMessage();
  const deleteMutation = useDeleteMediationContractMessage(contractId);

  // ==================== State ====================
  const [messageText, setMessageText] = useState('');
  const [fadingOutId, setFadingOutId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ==================== Translations ====================
  const t = useMemo(() => {
    const tr: Record<string, Record<string, string>> = {
      messages: { ar: 'الرسائل', en: 'Messages' },
      sendMessage: { ar: 'اكتب رسالة...', en: 'Type a message...' },
      send: { ar: 'إرسال', en: 'Send' },
      noMessages: { ar: 'لا توجد رسائل بعد', en: 'No messages yet' },
      confirmDelete: { ar: 'هل أنت متأكد من حذف هذه الرسالة؟', en: 'Delete this message?' },
      delete: { ar: 'حذف', en: 'Delete' },
      cancel: { ar: 'إلغاء', en: 'Cancel' },
    };
    return (key: string) => tr[key]?.[language] || tr[key]?.['en'] || key;
  }, [language]);

  // ==================== Auto-scroll ====================
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // ==================== Handlers ====================
  const handleSend = async () => {
    const text = messageText.trim();
    if (!text) return;
    setMessageText('');
    await createMutation.mutateAsync({
      contractId,
      message: text,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (id: number) => {
    setFadingOutId(id);
    setTimeout(async () => {
      await deleteMutation.mutateAsync(id);
      setFadingOutId(null);
    }, 300);
  };

  // ==================== Render ====================
  return (
    <div style={{ padding: '8px 0' }}>
      <h4
        style={{
          margin: '0 0 12px',
          color: '#003366',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <MessageOutlined /> {t('messages')}
      </h4>

      {/* Message list */}
      <div
        style={{
          maxHeight: 300,
          overflowY: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          background: '#fafafa',
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <Empty description={t('noMessages')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {messages.map((msg: MediationContractMessage) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 12,
                  alignItems: 'flex-start',
                  opacity: fadingOutId === msg.id ? 0 : 1,
                  transition: 'opacity 0.3s ease-out',
                  transform: fadingOutId === msg.id ? 'translateX(20px)' : 'none',
                }}
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ background: '#003366', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#003366', fontSize: 13 }}>
                      {msg.nameWorker || (isRTL ? 'مستخدم' : 'User')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tooltip
                        title={msg.createdAt ? dayjs(msg.createdAt).format('YYYY-MM-DD HH:mm') : ''}
                      >
                        <span style={{ fontSize: 11, color: '#aaa' }}>
                          {msg.createdAt ? dayjs(msg.createdAt).locale(language).fromNow() : ''}
                        </span>
                      </Tooltip>
                      <Popconfirm
                        title={t('confirmDelete')}
                        onConfirm={() => handleDelete(msg.id)}
                        okText={t('delete')}
                        cancelText={t('cancel')}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                          style={{ padding: '0 4px', height: 'auto' }}
                          aria-label={t('delete')}
                        />
                      </Popconfirm>
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <Input.TextArea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('sendMessage')}
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ flex: 1, borderRadius: 8 }}
          aria-label={t('sendMessage')}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={createMutation.isPending}
          disabled={!messageText.trim()}
          style={{ background: '#003366', borderColor: '#003366', borderRadius: 8 }}
          aria-label={t('send')}
        />
      </div>
    </div>
  );
}
