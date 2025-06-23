<template>
  <footer class="site-footer">
    <div class="footer-links">
      <a href="/privacy" target="_blank">隐私政策</a>
      <span>|</span>
      <a href="/terms" target="_blank">服务条款</a>
      <span>|</span>
      <a href="/contact" target="_blank">联系我们</a>
    </div>
    <div class="footer-copyright">
      © 2024 知卷AI. 保留所有权利.
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #f3f8ff;
  color: #888;
  font-size: 13px;
  text-align: center;
  padding: 32px 0 16px 0;
  border-top: 1px solid #eaeaea;
}
.footer-links {
  margin-bottom: 8px;
}
.footer-links a {
  color: #888;
  margin: 0 8px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #5db1ff;
}
.footer-links span {
  color: #ccc;
}

/* 移动端响应式适配 */
@media (max-width: 768px) {
  .site-footer {
    padding: 24px 16px 12px 16px; /* 减少上下间距，增加左右间距 */
    font-size: 12px; /* 稍小的字体 */
  }
  
  .footer-links {
    margin-bottom: 6px;
  }
  
  .footer-links a {
    margin: 0 6px; /* 减少链接间距 */
  }
}

@media (max-width: 480px) {
  .site-footer {
    padding: 20px 12px 10px 12px; /* 更紧凑的布局 */
    font-size: 11px;
  }
  
  .footer-links {
    margin-bottom: 4px;
    /* 可以考虑将链接换行显示 */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }
  
  .footer-links a {
    margin: 0 4px;
  }
  
  .footer-links span {
    margin: 0 2px;
  }
}
</style> 