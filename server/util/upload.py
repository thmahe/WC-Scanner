import sys
import yagmail
from . import context_finder as context

def send_email_zip_project(project_name):
    receiver = "lelbi36@gmail.com"
    body = "Hello my friend"

    yag =  yagmail.SMTP(user="wcscannerter@gmail.com", password="wcscanner06")
    yag.send(
        to=receiver,
        subject = "test send mail",
        contents = body,
    )
