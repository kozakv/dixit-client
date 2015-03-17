from __future__ import with_statement
from fabric.api import *

# env.hosts = ['dima@192.168.0.16']

def deploy_client(glassfish_home, domain_name = "domain1"):
    # print(glassfish_home + "/glassfish/domains/" + domain_name + "/applications/dixit-0.0.1/")
    put("dist/*", glassfish_home + "/glassfish/domains/" + domain_name + "/applications/dixit-0.0.1/")
