#!/usr/bin/env bash

getent passwd "steelfig" > /dev/null || useradd -rU "steelfig"
chown -R steelfig:steelfig /opt/steelfig/*
service nginx restart
service rsyslog restart

AWSLOGS_CONFIG_FILE="/var/awslogs/etc/awslogs.conf"
if [[ -f ${AWSLOGS_CONFIG_FILE} && !($(cat $AWSLOGS_CONFIG_FILE) =~ steelfig) ]]; then
    >&2 echo "
[/var/log/steelfig.log]
datetime_format = %b %d %H:%M:%S
file = /var/log/steelfig.log
buffer_duration = 5000
log_stream_name = {hostname}
initial_position = end_of_file
log_group_name = /var/log/steelfig.log
        " >> ${AWSLOGS_CONFIG_FILE}

    service awslogs restart
fi
