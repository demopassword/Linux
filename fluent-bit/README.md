install firehose
- https://docs.fluentbit.io/manual/installation/linux/amazon-linux#install-on-amazon-linux-2c

```bash
curl https://raw.githubusercontent.com/fluent/fluent-bit/master/install.sh | sh
```

/etc/fluent-bit/fluent-bit.conf (apache logs)
```bash
[SERVICE]
    flush        1
    daemon       Off
    log_level    info
    parsers_file parsers.conf
    plugins_file plugins.conf
    http_server  Off
    http_listen  0.0.0.0
    http_port    2020
    storage.metrics on
[INPUT]
    name tail
    path /var/log/httpd/access_log
    parser apache2                      # apache2 파서 선택
[OUTPUT]
    name  stdout
    match *
[FILTER]
    Name record_modifier
    Match *
    Record  user ${USER}                # ${USER} env 확인시 있어야함
    Record message "hello text message"    # 추가할 필드
    Remove_key user                    # 삭제할 필드
    Remove_key referer
    Remove_key agent
    Remove_key size

[FILTER]
    Name aws
    Match *
    imds_version v2
    ec2_instance_id true
    az false                            # 기본적으로 az가 true 설정되어 있음
    tags_enabled true                   # 태그 활성화 ( 비활성화시 수정 불가능 )
[FILTER]
    Name    modify
    Match   *
    Rename ec2_instance_id ec2_id       # 이름 재정의
[FILTER]
    Name    modify
    Match   *
    Condition Key_Value_Equals host ::1 #조건문 ::1일경우 host를 127.0.0.1로 변경
    Set host 127.0.0.1
```

---
## golang gin logs

running golang Framework
```sh
nohup ./main > app.log &
```

### init
```bash
[GIN] 2023/10/08 - 01:16:55 | 200 |      93.115µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      37.064µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      51.613µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      34.103µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      37.856µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      34.124µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |       35.87µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:56 | 200 |      38.291µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:57 | 200 |      34.396µs |       127.0.0.1 | GET      "/"
[GIN] 2023/10/08 - 01:16:58 | 200 |      30.027µs |       127.0.0.1 | GET      "/"
```
```
[0] tail.0: [[1696727994.691315814, {}], {"log"=>"[GIN] 2023/10/08 - 01:19:54 | 200 |      62.023µs |       127.0.0.1 | GET      "/""}]
```

### /etc/fluent-bit/parsers.conf
```bash
[PARSER]
    Name    custom
    Format  regex
    Regex   \[GIN\] (?<timestamp>[^|]*) \| (?<status>[^|]*) \| [^\S]* (?<response_time>[^|]*) \| [^\S]* (?<ip>[^|]*) \| (?<method>[^ ]*) [^\S]* "(?<path>[^ ]*)"
    Time_Key timestamp
    Time_Format %Y/%m/%d - %H:%M:%S
    Time_Keep On

# [^\S]* -> 공백 전체 제거
# \| -> 이스케이프 처리 | (파이프)를 제거해줌
# \[GIN]\ -> 이스케이프 처리 [GIN]을 제거해줌
# [^|]* -> | 가 포함된 문자열을 제외한 모든 문자 선택
# [^ ]* -> 공백이 포함된 문자열을 제외한 모든 문자 선택
# \s* -> 공백 전체 제거
# Time_Keep On 해당 옵션을 활성화하면 timestamp도 같이 전송된다.
```

### /etc/fluent-bit/fluent-bit.conf
```
[SERVICE]
    flush        1
    daemon       Off
    log_level    info
    parsers_file parsers.conf
    plugins_file plugins.conf
    http_server  Off
    http_listen  0.0.0.0
    http_port    2020
    storage.metrics on
[INPUT]
    name tail
    path /root/app.log
    parser custom
[OUTPUT]
    name  stdout
    match *
[FILTER]
    Name aws
    Match *
    imds_version v2
    ec2_instance_id true
    az false
    tags_enabled true
[FILTER]
    Name grep
    Match *
    Exclude path $/healthcheck$        # /healthcheck 경로 제외 /a/healthcheck는 허용됨
[FILTER]
    Name    modify
    Match   *
    Rename ec2_instance_id ec2_id
```

### output

```bash
[0] tail.0: [[1696731570.000000000, {}], {"timestamp"=>"2023/10/08 - 02:19:30", "status"=>"200", "response_time"=>"35.224µs", "ip"=>"127.0.0.1", "method"=>"GET", "path"=>"/", "ec2_id"=>"i-01b2655cb2c593751"}]
```
