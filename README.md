httpd + alb mod_jk proxy
```bash
yum install httpd -y
systemctl restart httpd
# /etc/httpd/conf/httpd.conf에서 아래 라인 추가
  <VirtualHost *:80>
    ProxyRequests Off
    ProxyPreserveHost On
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    ProxyPass / http://elb-loadbalancer-862954463.ap-northeast-2.elb.amazonaws.com:80/ disablereuse=on   #alb 도메인주소로 적절히 변경한다.
    ProxyPassReverse / http://elb-loadbalancer-862954463.ap-northeast-2.elb.amazonaws.com:80/
</VirtualHost>
```
