## cronie install
```bash
#!/bin/bash
yum install -y cronie
systemctl restart crond
vim /etc/crontab
*/5 * * * * root /opt/shell.sh
crontab -e
*/5 * * * * root /opt/shell.sh
```

- 5분마다 /opt/shell.sh이 실행되는걸 확인할 수 있다.

## shell script
/opt/shell.sh을 5분마다 실행하는 스크립트이다.

/opt/shell1.sh
```bash
while ture
do
    /opt/shell.sh
    sleep 300
done
```

run command
```bash
chmod +x /opt/shell1.sh
nohup /opt/shell1.sh  &
```