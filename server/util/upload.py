import sys
import yagmail
from . import context_finder as context
from py3wetransfer import Py3WeTransfer

def send_email_zip_project(project_name):
    #file_transfer = Py3WeTransfer("73964bc4-939e-4fcd-bf47-31931fd7cf45")
    file_path = '{}/{}/{}.zip'.format(context.__PROJECTS_PATH__, project_name, project_name)
    #url_transfer = file_transfer.upload_file(file_path, "upload")
    receiver = "lelbi36@gmail.com"
    body = "envoie test : "
    yag =  yagmail.SMTP(user="wcscannerter@gmail.com", password="wcscanner06")
    yag.send(
        to=receiver,
        subject = "test send mail",
        contents = body,
        attachments= file_path
    )
