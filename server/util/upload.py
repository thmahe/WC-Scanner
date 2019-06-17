import sys
import yagmail
from . import context_finder as context
from py3wetransfer import Py3WeTransfer

def send_email_zip_project(project_name, email_to):
    #file_transfer = Py3WeTransfer("73964bc4-939e-4fcd-bf47-31931fd7cf45")
    file_path = '{}/{}.zip'.format(context.__EXPORT_FOLDER__, project_name)
    #url_transfer = file_transfer.upload_file(file_path, "upload")
    receiver = email_to
    body = "projet en piece joint. "
    yag = yagmail.SMTP(user="wcscannerter@gmail.com", password="wcscanner06")
    yag.send(
        to=receiver,
        subject = "Envoie du projet",
        contents = body,
        attachments= file_path
    )
